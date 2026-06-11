resource "google_artifact_registry_repository" "repo" {
  provider = google
  location = var.region
  repository_id = "chat-app"
  format = "DOCKER"
}