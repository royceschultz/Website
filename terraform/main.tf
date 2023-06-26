terraform {
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "1.10.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
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

variable "aws_access_key" {
  type    = string
  default = ""
}

variable "aws_secret_key" {
  type    = string
  default = ""
}

provider "aws" {
  region = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
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

module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "my-lambda1"
  description   = "My awesome lambda function"
  handler       = "index.lambda_handler"
  runtime       = "python3.8"

  source_path = "../lambda"

  tags = {
    Name = "my-lambda1"
  }
}
