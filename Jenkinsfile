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

        stage('Docker Build') {
            parallel {
                stage('Backend Image') {
                    steps {
                        container('kaniko') {
                            sh '''
                                /kaniko/executor \
                                --context="${WORKSPACE}/backend" \
                                --dockerfile="${WORKSPACE}/backend/Dockerfile" \
                                --no-push \
                                --snapshot-mode=redo \
                                --destination=lycody/tasknest-backend:test
                            '''
                        }
                    }
                }

                stage('Frontend Image') {
                    steps {
                        container('kaniko') {
                            sh '''
                                /kaniko/executor \
                                --context="${WORKSPACE}/frontend" \
                                --dockerfile="${WORKSPACE}/frontend/Dockerfile" \
                                --no-push \
                                --snapshot-mode=redo \
                                --destination=lycody/tasknest-frontend:test
                            '''
                        }
                    }
                }
            }
        }
    }
}