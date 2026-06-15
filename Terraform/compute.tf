resource "google_compute_instance" "default" {
    name         = var.gce-instance-name
    machine_type = var.gce_machine_type
    zone         = var.zone

    tags = ["http-server", "https-server", "apply-to-all"]

    boot_disk {
        initialize_params {
            image = var.gce_instance_image
        }
    }

    network_interface {
        network = "default"
        access_config {}
    }

    attached_disk {
        source = google_compute_disk.extra_disk.id
    }
}

resource "google_compute_disk" "extra_disk" {
    name = "persistent-disk2"
    type = "pd-standard"
    zone = var.zone
    size = var.gce_instance_volume_size
}

resource "google_compute_firewall" "default" {
    name    = "allow-http-chat-app"
    network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "4000", "3001", "5001", "22",9090,8080,3002,1013]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["http","https","allow-app"]
}