pipeline{
    agent any
    environment {
        APP_PORT = "53621"
        DB_PORT = "52634"
        VERSION = "1.0.0"
        NAME = "register"
    }
    stages{
        stage("Packages installation"){
            steps{
                sh "yarn install"
                sh "mkdir -p tests/reports"
            }
        }

        stage("Test"){
            stages{
                stage("Create test DB"){
                    steps{
                        sh "docker run -dp ${DB_PORT}:5432 --rm --name dbTest -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=test postgres"
                        sh "echo DATABASE_URL=postgres://test:1234@localhost:${DB_PORT}/test > .env"
                        sh 'npx prisma db push'
                    }
                }

                stage("Run 4 instances"){
                    steps{
                        sh 'echo PROTOCOL=http > info.env'
                        sh 'echo PORT=${APP_PORT} >> info.env'
                        sh 'echo HOST=localhost >> info.env'
                        sh 'pm2 start index.js -i 4 --name pm2_Ins_MS_Register'
                        sh 'pm2 ps'
                    }
                }

                stage("Frisby test routes"){
                    steps{
                        sh 'yarn test > tests/reports/frisby.test'
                    }
                }

                stage("Artillery test scenarios (20s)"){
                    steps{
                        sh "npx artillery run tests/scen1.yml -c tests/config.yml -o tests/reports/report-test1.json -t http://localhost:${APP_PORT}"
                        sh 'npx artillery report tests/reports/report-test1.json -o tests/reports/report-test1.html'
                    }
                }
            }

            post{
                always{
                    sh 'docker stop dbTest'
                    sh 'pm2 delete pm2_Ins_MS_Register'
                }

                success {
                    archiveArtifacts artifacts: 'tests/reports/**.html', fingerprint: true
                }
            }
        }

        stage("Staging"){
            steps{
                sh 'echo staging'
            }
        }

        stage("Create packages"){
            steps{
                sh 'echo package'
            }
        }

        stage("Deployment"){
            environment{
                DOCKER_HUB="edykoffi"
            }
            parallel {
                stage("Deploy to planetHoster"){ 
                    steps{
                        sh 'echo deploy'
                    }
                }
                stage("Deploy to AWS EC2"){ 
                    steps{
                        sh 'echo deploy'
                    }
                }
                stage("Deploy to AWS ECS"){ 
                    steps{
                        sh 'echo deploy'
                    }
                }
                stage("Publish to AWS ECR"){ 
                    steps{
                        sh 'echo deploy'
                    }
                }
                stage("Publish to DockerHUB"){ 
                    steps{
                        sh 'echo deploy'
                    }
                }
            }
        }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}