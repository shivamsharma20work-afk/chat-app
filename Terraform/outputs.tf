output "instance_ip" {
    description = "VM public IP"
    value       = google_compute_instance.default.network_interface[0].access_config[0].nat_ip
}

output "artifact_registry_url" {
    description = "Docker images URL"
    value       = "${var.region}-docker.pkg.dev/${var.project_id}/chat-app"
}