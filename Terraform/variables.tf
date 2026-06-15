variable "project_id" {
    type        = string
    default     = "project-31e386f5-2cc7-4ee4-a4b"
}

variable "region" {
    type        = string
    default     = "us-central1"
}

variable "zone" {
    type        = string
    default     = "us-central1-b"
}

variable "gce_machine_type" {
    type        = string
    default     = "e2-medium"
}

variable "gce-instance-name" {
    type        = string
    default     = "chat-app-instance"
}

variable "gce_instance_image" {
    type        = string
    default     = "ubuntu-os-cloud/ubuntu-2204-lts"
}

variable "gce_instance_volume_size" {
    type        = number
    default     = 20
}