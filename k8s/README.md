# Kubernetes Deployment Guide

This project uses **Kustomize** to manage different environments (Minikube local, Dev, GKE Production) with a single configuration change.

## 📁 Structure

```
k8s/
├── base/                    # Base templates (reference only)
│   ├── deployment.yaml     # Generic deployment template
│   ├── service.yaml        # Generic service template
│   └── kustomization.yaml
├── gateway/                 # API Gateway service
│   ├── deployment.yaml     # Uses generic image: api-gateway
│   ├── service.yaml
│   └── kustomization.yaml
├── users/                   # Users service
│   ├── deployment.yaml     # Uses generic image: users-service
│   ├── service.yaml
│   └── kustomization.yaml
├── auctions/                # Auctions service
│   ├── deployment.yaml     # Uses generic image: auctions-service
│   ├── service.yaml
│   └── kustomization.yaml
├── rabbitmq/                # RabbitMQ infrastructure
├── redis/                   # Redis cache
├── overlays/
│   ├── minikube/           # Local Minikube environment
│   ├── dev/                # Dev environment
│   └── prod/               # GKE Production environment
└── kustomization.yaml      # Root kustomization (legacy)
```

## 🚀 Quick Start

### For Minikube (Local Development)

```bash
# 1. Start Minikube
minikube start

# 2. Build Docker images inside Minikube
eval $(minikube docker-env)
docker build -t api-gateway:latest -f apps/gateway/Dockerfile .
docker build -t users-service:latest -f apps/users/Dockerfile .
docker build -t auctions-service:latest -f apps/auctions/Dockerfile .

# 3. Deploy to Minikube
kubectl apply -k k8s/overlays/minikube
```

### For GKE (Production)

```bash
# 1. Connect to GKE cluster
gcloud container clusters get-credentials your-cluster --region asia-southeast1

# 2. Deploy to GKE (uses GCR images)
kubectl apply -k k8s/overlays/prod
```

## 🔧 Environment Configuration

### Key Differences

| Environment | Registry | imagePullPolicy | Use Case |
|-------------|----------|-----------------|----------|
| **Minikube** | Local (Never pull) | `Never` | Local development |
| **Dev** | dev-registry/* | `IfNotPresent` | Docker Desktop/Dev cluster |
| **Prod** | GCR/GAR | `Always` | GKE Production |

### Changing Registry for Your GCP Project

Edit `k8s/overlays/prod/kustomization.yaml`:

```yaml
images:
  - name: api-gateway
    newName: <YOUR_REGION>-docker.pkg.dev/<YOUR_PROJECT>/<YOUR_REPO>/api-gateway
    newTag: latest
```

## 📝 Deployment Commands

```bash
# View what will be applied (dry run)
kubectl kustomize k8s/overlays/minikube

# Apply configuration
kubectl apply -k k8s/overlays/<environment>

# Delete configuration
kubectl delete -k k8s/overlays/<environment>

# Check deployment status
kubectl get deployments
kubectl get pods
```

## 🔄 Making Changes

1. **Base changes** (apply to all environments):
   - Edit files in `k8s/base/` or service folders

2. **Environment-specific changes**:
   - Edit the corresponding overlay in `k8s/overlays/<env>/`

3. **Change environment**:
   - Simply switch the overlay path: `minikube` → `prod`

## 💡 Tips

- **Minikube**: Always use `imagePullPolicy: Never` so it uses local images
- **GKE**: Use `imagePullPolicy: Always` to always pull latest images
- **Secrets**: Make sure to create secrets before deploying:
  ```bash
  kubectl create secret generic api-gateway-secrets --from-env-file=k8s/gateway/secret.env
  ```
