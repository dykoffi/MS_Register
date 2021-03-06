pipeline{
    agent any
    environment {
        APP_NAME    = "register"
        APP_PORT    = "53621"
        DB_PORT     = "23586"
        APP_VERSION = "1.2.1"
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
                        sh "docker-compose up -d db_test"
                        sh "echo DATABASE_URL=postgres://register_db_dev_test:1234@localhost:${DB_PORT}/test > .env"
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
                        sh "npx artillery report tests/reports/report-test1.json -o tests/reports/report-test1.html"
                    }
                }
            }

            post{
                always{
                    sh 'docker-compose stop db_test'
                    sh 'pm2 delete pm2_Ins_MS_Register'
                }

                success {
                    archiveArtifacts artifacts: 'tests/reports/**.*', fingerprint: true
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
                sh "cqx build"
                sh "zip -r build.zip build"
                sh "docker build -t dykoffi/${APP_NAME}:${APP_VERSION} ."
            }

            post{
                always{
                    sh "rm -rdf build"
                }
                success{
                     archiveArtifacts artifacts: 'build.zip', fingerprint: true
                }
            }
        }

        stage("Deployment"){
            environment{
                DOCKERHUB_CREDENTIALS = credentials('docker-hub-1')
                PLANETHOSTER_CREDENTIALS = credentials('PLANETHOSTER_CREDENTIALS')
                AWS_EC2_PRKEY = credentials('AWS_EC2_PRKEY')
            }
            parallel {
                stage("Deploy to planetHoster"){ 
                    steps{
                        sh 'cqx deploy '
                    }
                }
                stage("Deploy to AWS EC2"){ 
                    steps{
                        sh 'cqx deploy'
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
                        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                        sh "docker push dykoffi/${APP_NAME}:${APP_VERSION}"
                    }

                    post{
                        always{
                            sh 'docker logout'
                        }
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