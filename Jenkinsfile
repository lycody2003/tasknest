pipeline {
    agent {
        label 'tasknest-node'
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {

        stage('Checkout') {
            steps {
                git(
                    url: 'git@github.com:lycody2003/tasknest.git',
                    branch: 'main',
                    credentialsId: 'github-ssh'
                )
            }
        }

        stage('Get Image Tag') {
            steps {
                container('node') {
                    script {
                        env.IMAGE_TAG = sh(
                            script: 'git rev-parse --short HEAD',
                            returnStdout: true
                        ).trim()

                        echo "Image tag: ${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Quality Code') {
            parallel {

                stage('Backend Lint') {
                    steps {
                        container('node') {
                            dir('backend') {
                                sh 'npm ci'
                                sh 'npm run lint'
                            }
                        }
                    }
                }

                stage('Frontend Lint') {
                    steps {
                        container('node') {
                            dir('frontend') {
                                sh 'npm ci'
                                sh 'npm run lint'
                            }
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {

                stage('Backend Tests') {
                    steps {
                        container('node') {
                            dir('backend') {
                                sh 'npm ci'
                                sh 'npm test'
                            }
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        container('node') {
                            dir('frontend') {
                                sh 'npm ci'
                                sh 'npm test'
                            }
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            stages {

                stage('Backend Image') {
                    steps {
                        container('kaniko') {
                            withCredentials([
                                usernamePassword(
                                    credentialsId: 'dockerhub-credentials',
                                    usernameVariable: 'DOCKERHUB_USERNAME',
                                    passwordVariable: 'DOCKERHUB_TOKEN'
                                )
                            ]) {
                                sh '''
                                    mkdir -p /kaniko/.docker

                                    AUTH=$(printf "%s:%s" "$DOCKERHUB_USERNAME" "$DOCKERHUB_TOKEN" \
                                        | base64 \
                                        | tr -d '\\n')

                                    printf '{"auths":{"https://index.docker.io/v1/":{"auth":"%s"}}}' "$AUTH" \
                                        > /kaniko/.docker/config.json

                                    echo "Building backend image: $IMAGE_TAG"

                                    /kaniko/executor \
                                        --context="${WORKSPACE}/backend" \
                                        --dockerfile="${WORKSPACE}/backend/Dockerfile" \
                                        --destination=lycody/tasknest-backend:$IMAGE_TAG \
                                        --snapshot-mode=redo
                                '''
                            }
                        }
                    }
                }

                stage('Frontend Image') {
                    steps {
                        container('kaniko') {
                            withCredentials([
                                usernamePassword(
                                    credentialsId: 'dockerhub-credentials',
                                    usernameVariable: 'DOCKERHUB_USERNAME',
                                    passwordVariable: 'DOCKERHUB_TOKEN'
                                )
                            ]) {
                                sh '''
                                    mkdir -p /kaniko/.docker

                                    AUTH=$(printf "%s:%s" "$DOCKERHUB_USERNAME" "$DOCKERHUB_TOKEN" \
                                        | base64 \
                                        | tr -d '\\n')

                                    printf '{"auths":{"https://index.docker.io/v1/":{"auth":"%s"}}}' "$AUTH" \
                                        > /kaniko/.docker/config.json

                                    echo "Building frontend image: $IMAGE_TAG"

                                    /kaniko/executor \
                                        --context="${WORKSPACE}/frontend" \
                                        --dockerfile="${WORKSPACE}/frontend/Dockerfile" \
                                        --destination=lycody/tasknest-frontend:$IMAGE_TAG \
                                        --snapshot-mode=redo
                                '''
                            }
                        }
                    }
                }

            }
        }

        stage('Update GitOps') {
            steps {
                container('node') {
                    withCredentials([
                        sshUserPrivateKey(
                            credentialsId: 'github-ssh',
                            keyFileVariable: 'SSH_KEY',
                            usernameVariable: 'SSH_USER'
                        )
                    ]) {
                        sh '''
                            mkdir -p ~/.ssh

                            cp "$SSH_KEY" ~/.ssh/id_ed25519
                            chmod 600 ~/.ssh/id_ed25519

                            ssh-keyscan github.com >> ~/.ssh/known_hosts

                            rm -rf gitops

                            git clone \
                                git@github.com:lycody2003/tasknest-infrastructure.git \
                                gitops

                            cd gitops

                            git config user.name "Jenkins"
                            git config user.email "jenkins@tasknest.local"

                            echo "Updating GitOps to image tag: $IMAGE_TAG"

                            sed -i 's#image: lycody/tasknest-backend:.*#image: lycody/tasknest-backend:'"$IMAGE_TAG"'#' \
                                applications/backend/deployment.yaml

                            sed -i 's#image: lycody/tasknest-frontend:.*#image: lycody/tasknest-frontend:'"$IMAGE_TAG"'#' \
                                applications/frontend/deployment.yaml

                            git add \
                                applications/backend/deployment.yaml \
                                applications/frontend/deployment.yaml

                            git diff --cached

                            git commit -m "chore: update TaskNest images to $IMAGE_TAG" || true

                            git push origin main
                        '''
                    }
                }
            }
        }

    }
}