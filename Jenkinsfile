pipeline {
  agent {
    kubernetes {
      defaultContainer 'docker-agent'
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    some-label: docker
spec:
  containers:
  - name: docker-agent
    image: chad0/jenkins-with-docker
    command:
    - cat
    tty: true
    env:
      - name: DOCKER_HOST
        value: tcp://localhost:2375
      - name: DOCKER_TLS_VERIFY
        value: "0"
      - name: DOCKER_CERT_PATH
        value: ""

  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    args:
    - --host=tcp://0.0.0.0:2375
    - --host=unix:///var/run/docker.sock
    volumeMounts:
    - name: docker-graph
      mountPath: /var/lib/docker

  volumes:
  - name: docker-graph
    emptyDir: {}
"""
    }
  }

  environment {
    IMAGE_NAME = 'thriftx-backend'
    REGISTRY = 'chad0'
    DOCKER_TAG = 'new'
    KUBECONFIG = '/var/jenkins_home/.kube/config'
  }

  stages {
    stage('Clone Repo') {
      steps {
        git branch: 'main', url: 'https://github.com/Chad-007/THRIFT-X.git'
      }
    }

    stage('Build App') {
      steps {
        dir('ThriftX-Backend') {
          sh './mvnw clean package -DskipTests'
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        container('docker-agent') {
          dir('ThriftX-Backend') {
            sh "docker build -t $REGISTRY/$IMAGE_NAME:$DOCKER_TAG ."
          }
        }
      }
    }

    stage('Push Image') {
      steps {
        container('docker-agent') {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh '''
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
              docker push $REGISTRY/$IMAGE_NAME:$DOCKER_TAG
            '''
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          echo "Applying K8s deployment using kubeconfig at $KUBECONFIG"
          kubectl apply -f ThriftX-Backend/deployment.yml
          kubectl rollout restart deployment thriftx-backend
        '''
      }
    }
  }
}
