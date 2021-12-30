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
                sh "mkdir tests/reports"
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
                        sh 'yarn test'
                    }
                }

                stage("Artillery test scenarios (20s)"){
                    steps{
                        sh "npx artillery run tests/scen1.yml -c tests/config.yml -o tests/report-test1.json -t http://localhost:${APP_PORT}"
                        sh 'npx artillery report tests/report-test1.json -o tests/report-test1.html'
                    }
                }
            }

            post{
                always{
                    sh 'docker stop dbTest'
                    sh 'pm2 delete pm2_Ins_MS_Register'
                }
            }
        }

        stage("Staging"){
            steps{}
        }

        stage("Create packages"){
            steps{}
        }

        stage("Deployment"){
            environment{

            }
            parallel {
                stage("Deploy to planetHoster"){ steps{}}
                stage("Deploy to AWS EC2"){ steps{}}
                stage("Deploy to AWS ECS"){ steps{}}
                stage("Publish to AWS ECR"){ steps{}}
                stage("Publish to DockerHUB"){ steps{}}
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