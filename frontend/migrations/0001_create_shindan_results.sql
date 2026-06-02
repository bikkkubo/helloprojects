CREATE TABLE IF NOT EXISTS shindan_results (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  member_color TEXT NOT NULL,
  primary_type TEXT NOT NULL,
  primary_label TEXT NOT NULL,
  secondary_type TEXT NOT NULL,
  secondary_label TEXT NOT NULL,
  result_title TEXT NOT NULL,
  scores_json TEXT NOT NULL,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_shindan_results_created_at ON shindan_results(created_at);
CREATE INDEX IF NOT EXISTS idx_shindan_results_member_id ON shindan_results(member_id);
CREATE INDEX IF NOT EXISTS idx_shindan_results_group_name ON shindan_results(group_name);
CREATE INDEX IF NOT EXISTS idx_shindan_results_primary_type ON shindan_results(primary_type);
