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

                                    /kaniko/executor \
                                        --context="${WORKSPACE}/backend" \
                                        --dockerfile="${WORKSPACE}/backend/Dockerfile" \
                                        --destination=lycody/tasknest-backend:1.0.1 \
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

                                    /kaniko/executor \
                                        --context="${WORKSPACE}/frontend" \
                                        --dockerfile="${WORKSPACE}/frontend/Dockerfile" \
                                        --destination=lycody/tasknest-frontend:1.0.1 \
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

                            sed -i 's#image: lycody/tasknest-backend:.*#image: lycody/tasknest-backend:test#' \
                                applications/backend/deployment.yaml

                            sed -i 's#image: lycody/tasknest-frontend:.*#image: lycody/tasknest-frontend:test#' \
                                applications/frontend/deployment.yaml

                            git add \
                                applications/backend/deployment.yaml \
                                applications/frontend/deployment.yaml

                            git diff --cached

                            git commit -m "chore: update TaskNest images" || true

                            git push origin main
                        '''
                    }
                }
            }
        }

    }
}