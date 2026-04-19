/**
 * Declarative Jenkins pipeline for devops-task-tracker.
 *
 * Intended for classroom demos: each stage has a clear purpose.
 * SonarQube and deploy steps assume you configure credentials/tools in Jenkins
 * (see README "Manual setup" section).
 *
 * Windows agents: uses `bat` steps (cmd.exe) and PowerShell where needed.
 */
pipeline {
    agent any

    options {
        timestamps()
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
                bat 'call npm ci || call npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube scanner (requires Jenkins SonarQube plugin + tool named sonar-scanner)...'
                // Uncomment when Jenkins has SonarQube Scanner + server configured:
                // withSonarQubeEnv('SonarQube') {
                //     bat 'sonar-scanner.bat'
                // }
                bat 'echo SonarQube: configure withSonarQubeEnv and sonar-scanner in Jenkins to run real analysis.'
            }
        }

        stage('Build') {
            steps {
                echo 'Build: Node app has no compile step — validating project starts.'
                bat '''
                    call node -c src\\server.js
                    call node -c src\\app.js
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running Jest unit tests with coverage...'
                bat 'call npm run test:coverage'
            }
        }

        stage('Deliver') {
            steps {
                echo 'Packaging deliverable artifact (zip)...'
                bat '''
                    if exist deliverables rmdir /s /q deliverables
                    mkdir deliverables
                    powershell -NoProfile -Command "$exclude = @('node_modules','coverage','deliverables','.git'); Get-ChildItem -LiteralPath . -Force | Where-Object { $exclude -notcontains $_.Name } | Compress-Archive -DestinationPath (Join-Path 'deliverables' ($env:ARTIFACT_NAME + '-' + $env:BUILD_NUMBER + '.zip')) -Force"
                '''
            }
        }

        stage('Deploy to Dev') {
            steps {
                echo 'Mock deploy to DEV — copy artifact and simulate app launch.'
                bat '''
                    if exist deploy\\dev rmdir /s /q deploy\\dev
                    mkdir deploy\\dev
                    xcopy src deploy\\dev\\src\\ /E /I /Y
                    xcopy public deploy\\dev\\public\\ /E /I /Y
                    copy /Y package.json deploy\\dev\\
                    if exist package-lock.json copy /Y package-lock.json deploy\\dev\\
                    echo DEV: Simulated start -^> npm install ^&^& npm start (port 3000)
                '''
            }
        }

        stage('Deploy to QAT') {
            steps {
                echo 'Mock deploy to QAT'
                bat '''
                    if exist deploy\\qat rmdir /s /q deploy\\qat
                    mkdir deploy\\qat
                    xcopy deploy\\dev\\* deploy\\qat\\ /E /I /Y
                    echo QAT: artifact promoted from DEV folder (demo only).
                '''
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Mock deploy to Staging'
                bat '''
                    if exist deploy\\staging rmdir /s /q deploy\\staging
                    mkdir deploy\\staging
                    xcopy deploy\\qat\\* deploy\\staging\\ /E /I /Y
                    echo STAGING: ready for final checks before production.
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Mock deploy to Production'
                bat '''
                    if exist deploy\\production rmdir /s /q deploy\\production
                    mkdir deploy\\production
                    xcopy deploy\\staging\\* deploy\\production\\ /E /I /Y
                    echo PRODUCTION: mock deployment complete (no real servers touched).
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
            echo 'Pipeline failed — check stage logs (tests, SonarQube, or batch steps).'
        }
    }
}
