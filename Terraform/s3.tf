terraform {
  required_version = ">= 1.0"

  backend "gcs" {
    bucket  = "shivam-tf-state-bucket"   # apna bucket name
    prefix  = "artifact-registry"        # folder jaisa treat hota hai
  }
}