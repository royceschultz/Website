terraform {
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "1.10.0"
    }
  }
}

# Configure Variables in external variables file.
# Acceptable file names:
#  terraform.tfvars
#  terraform.tfvars.json
#  <name>.auto.tfvars
#  Reccomended: <name>.local.auto.tfvars (not tracked by git)

variable "atlas_public_key" {
  type    = string
  default = ""
}

variable "atlas_private_key" {
  type    = string
  default = ""
}

provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}

resource "mongodbatlas_advanced_cluster" "test" {
  project_id   = "6498d6204413fe4680bcd1ea"
  name         = "demo-cluster"
  cluster_type = "REPLICASET"
  replication_specs {
    region_configs {
      electable_specs {
        instance_size = "M0"
        node_count    = 0
      }
      provider_name         = "TENANT"
      backing_provider_name = "AWS"
      priority      = 7
      region_name   = "US_EAST_1"
    }
  }
}
