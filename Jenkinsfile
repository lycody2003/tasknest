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
                                        --destination=lycody/tasknest-backend:test \
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
                                        --destination=lycody/tasknest-frontend:test \
                                        --snapshot-mode=redo
                                '''
                            }
                        }
                    }
                }

            }
        }
    }
}