pipeline {
    agent {
        label 'tasknest-node'
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
    }
}