-- =====================================================
-- EXTENSIONS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =====================================================
-- DOCUMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,

    workspace_id TEXT DEFAULT 'local',

    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,

    size_bytes BIGINT,
    checksum TEXT,

    status TEXT NOT NULL DEFAULT 'uploaded',
    source TEXT DEFAULT 'upload',

    summary TEXT,

    embedding_model TEXT DEFAULT 'nomic-embed-text',
    embedding_dimension INT DEFAULT 768,

    embedding VECTOR(768),

    metadata JSONB DEFAULT '{}'::jsonb,

    progress INTEGER DEFAULT 0,
    error_message TEXT,
    chunk_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- =====================================================
-- CHUNKS
-- =====================================================

CREATE TABLE IF NOT EXISTS chunks (
    id BIGSERIAL PRIMARY KEY,

    document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

    chunk_index INT NOT NULL,

    content TEXT NOT NULL,

    token_count INT,
    page_number INT,
    section_title TEXT,

    start_offset INT,
    end_offset INT,

    embedding_model TEXT DEFAULT 'nomic-embed-text',
    embedding_dimension INT DEFAULT 768,

    embedding VECTOR(768) NOT NULL,

    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT chunks_document_chunk_unique UNIQUE (document_id, chunk_index)
);


-- =====================================================
-- CHAT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    document_ids JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id),
    role TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


-- =====================================================
-- INDEXES (CORE RELATIONAL)
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_documents_workspace
ON documents(workspace_id);

CREATE INDEX IF NOT EXISTS idx_documents_status
ON documents(status);

CREATE INDEX IF NOT EXISTS idx_documents_created_at
ON documents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id
ON chunks(document_id);

CREATE INDEX IF NOT EXISTS idx_chunks_created_at
ON chunks(created_at DESC);


-- =====================================================
-- JSONB INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_documents_metadata
ON documents USING GIN(metadata);

CREATE INDEX IF NOT EXISTS idx_chunks_metadata
ON chunks USING GIN(metadata);


-- =====================================================
-- FULL TEXT SEARCH (CLEAN - SINGLE SYSTEM)
-- =====================================================

ALTER TABLE chunks
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(content, ''))
) STORED;

CREATE INDEX IF NOT EXISTS idx_chunks_search_vector
ON chunks USING GIN(search_vector);


-- =====================================================
-- VECTOR SEARCH (OPTIMIZED FOR RAG)
-- =====================================================

-- IMPORTANT:
-- HNSW is preferred over IVFFLAT for most RAG workloads:
-- - better recall
-- - faster queries
-- - no training step required

CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
ON chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- documents-level vector search (optional, lighter weight)
CREATE INDEX IF NOT EXISTS idx_documents_embedding_hnsw
ON documents
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);


-- =====================================================
-- UPDATED_AT TRIGGER (ONLY WHERE NEEDED)
-- =====================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_documents_updated_at ON documents;

CREATE TRIGGER trg_documents_updated_at
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- =====================================================
-- VIEW FOR RETRIEVAL
-- =====================================================

CREATE OR REPLACE VIEW chunk_with_document AS
SELECT
    c.id,
    c.document_id,
    d.filename,
    d.original_name,
    d.source,
    c.chunk_index,
    c.page_number,
    c.section_title,
    c.content,
    c.metadata,
    c.created_at
FROM chunks c
JOIN documents d ON d.id = c.document_id
WHERE d.deleted_at IS NULL;


-- =====================================================
-- ANALYZE (optional, safe for first run)
-- =====================================================

ANALYZE documents;
ANALYZE chunks;