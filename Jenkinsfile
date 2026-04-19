/**
 * Declarative Jenkins pipeline for devops-task-tracker.
 *
 * Intended for classroom demos: each stage has a clear purpose.
 * SonarQube and deploy steps assume you configure credentials/tools in Jenkins
 * (see README "Manual setup" section).
 */
pipeline {
    agent any

    options {
        timestamps()
        ansiColor('xterm')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    environment {
        // Adjust if your SonarQube server host/token differ
        SONAR_HOST_URL = "${env.SONAR_HOST_URL ?: 'http://localhost:9000'}"
        ARTIFACT_NAME = "devops-task-tracker"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source from SCM...'
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci || npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube scanner (requires Jenkins SonarQube plugin + tool named sonar-scanner)...'
                // Uncomment when Jenkins has SonarQube Scanner + server configured:
                // withSonarQubeEnv('SonarQube') {
                //     sh 'sonar-scanner'
                // }
                sh 'echo "SonarQube: configure withSonarQubeEnv and sonar-scanner in Jenkins to run real analysis."'
            }
        }

        stage('Build') {
            steps {
                echo 'Build: Node app has no compile step — validating project starts.'
                sh 'node -c src/server.js && node -c src/app.js'
            }
        }

        stage('Test') {
            steps {
                echo 'Running Jest unit tests with coverage...'
                sh 'npm run test:coverage'
            }
        }

        stage('Deliver') {
            steps {
                echo 'Packaging deliverable artifact (zip)...'
                sh '''
                    rm -rf deliverables
                    mkdir -p deliverables
                    zip -r "deliverables/${ARTIFACT_NAME}-${BUILD_NUMBER}.zip" . \
                      -x "*/node_modules/*" "*/coverage/*" "*/deliverables/*" "*/.git/*"
                '''
            }
        }

        stage('Deploy to Dev') {
            steps {
                echo 'Mock deploy to DEV — copy artifact and simulate app launch.'
                sh '''
                    mkdir -p deploy/dev
                    cp -r src public package.json package-lock.json deploy/dev/ 2>/dev/null || \
                    cp -r src public package.json deploy/dev/
                    echo "DEV: Simulated start -> npm install && npm start (port 3000)"
                '''
            }
        }

        stage('Deploy to QAT') {
            steps {
                echo 'Mock deploy to QAT'
                sh '''
                    mkdir -p deploy/qat
                    cp -r deploy/dev/* deploy/qat/
                    echo "QAT: artifact promoted from DEV folder (demo only)."
                '''
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Mock deploy to Staging'
                sh '''
                    mkdir -p deploy/staging
                    cp -r deploy/qat/* deploy/staging/
                    echo "STAGING: ready for final checks before production."
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Mock deploy to Production'
                sh '''
                    mkdir -p deploy/production
                    cp -r deploy/staging/* deploy/production/
                    echo "PRODUCTION: mock deployment complete (no real servers touched)."
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'All stages completed successfully.'
        }
        failure {
            echo 'Pipeline failed — check stage logs (tests, SonarQube, or shell steps).'
        }
    }
}
