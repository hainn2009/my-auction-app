# Kubernetes Deployment Guide

This project uses Kustomize to manage multiple environments with one deploy structure:
Minikube, Dev, GKE Production, EKS Production, and EC2 + k3s.

## Structure

```text
k8s/
|-- gateway/                 # API Gateway service
|-- users/                   # Users service
|-- auctions/                # Auctions service
|-- rabbitmq/                # RabbitMQ infrastructure
|-- redis/                   # Redis cache
|-- overlays/
|   |-- minikube/            # Local Minikube environment
|   |-- dev/                 # Dev environment
|   |-- prod/                # GKE Production environment
|   |-- eks/                 # EKS Production environment
|   `-- k3s/                 # EC2 + k3s environment
`-- kustomization.yaml       # Root kustomization (legacy)
```

## Quick Start

### Minikube

```bash
minikube start
eval $(minikube docker-env)
docker build -t api-gateway:latest -f apps/gateway/Dockerfile .
docker build -t users-service:latest -f apps/users/Dockerfile .
docker build -t auctions-service:latest -f apps/auctions/Dockerfile .
kubectl apply -k k8s/overlays/minikube
```

### GKE

```bash
gcloud container clusters get-credentials your-cluster --region asia-southeast1
kubectl apply -k k8s/overlays/prod
```

### EKS

```bash
aws eks update-kubeconfig --region <your-region> --name <your-cluster-name>
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/aws/deploy.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
kubectl apply -k k8s/overlays/eks
```

### EC2 + k3s

```bash
curl -sfL https://get.k3s.io | sh -
sudo k3s kubectl get nodes
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
kubectl apply -k k8s/overlays/k3s
```

## Environment Notes

| Environment | Registry | imagePullPolicy | Use Case |
|-------------|----------|-----------------|----------|
| Minikube | Local image | `Never` | Local development |
| Dev | `dev-registry/*` | `IfNotPresent` | Docker Desktop / dev cluster |
| Prod | GCR / GAR | `Always` | GKE Production |
| EKS | AWS ECR | `Always` | EKS Production |
| k3s | Local registry or image tar load | `IfNotPresent` | Single-node EC2 |

## EC2 + k3s Setup

The k3s overlay expects:
- k3s is already installed on the EC2 instance
- the built-in Traefik ingress controller is available
- cert-manager is installed
- a real domain name for the API Gateway ingress
- a real email address for Let's Encrypt registration

Update `k8s/overlays/k3s/kustomization.yaml` with:
- `<your-domain>`
- `<your-email@example.com>`

If you build the images on the EC2 node, the names are just:
- `api-gateway:latest`
- `users-service:latest`
- `auctions-service:latest`

Example build commands on the EC2 host:

```bash
docker build -t api-gateway:latest -f apps/gateway/Dockerfile .
docker build -t users-service:latest -f apps/users/Dockerfile .
docker build -t auctions-service:latest -f apps/auctions/Dockerfile .
```

If you want to load tarballs into the node, you can use:

```bash
docker save api-gateway:latest | gzip > api-gateway.tar.gz
docker save users-service:latest | gzip > users-service.tar.gz
docker save auctions-service:latest | gzip > auctions-service.tar.gz
sudo k3s ctr images import api-gateway.tar.gz
sudo k3s ctr images import users-service.tar.gz
sudo k3s ctr images import auctions-service.tar.gz
```

## Deployment Commands

```bash
kubectl kustomize k8s/overlays/minikube
kubectl apply -k k8s/overlays/<environment>
kubectl delete -k k8s/overlays/<environment>
kubectl get deployments
kubectl get pods
```

## Secrets

Create secrets before deploying:

```bash
kubectl create secret generic api-gateway-secrets --from-env-file=k8s/gateway/secret.env
```
