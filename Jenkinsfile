  pipeline {
    agent {
      kubernetes {
        defaultContainer 'docker-agent'
       // yamFile "overridePodYAML"
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
      - sleep
      args:
      - "9999999"
      securityContext:
        privileged: true
        runAsUser: 0
      volumeMounts:
      - name: docker-sock
        mountPath: /var/run/docker.sock
    volumes:
    - name: docker-sock
      hostPath:
        path: /var/run/docker.sock
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
