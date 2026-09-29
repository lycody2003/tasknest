pipeline {
    agent any

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
    }
}