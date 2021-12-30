pipeline{
    agent any
    environment {
        VERSION = "1.0.0"
        NAME = "register"
    }
    stages{
        stage("Packages installation"){
            steps{
                sh "yarn install"
            }
        }
        stage("Test") {
            stages{
                stage("Create test DB"){
                    steps{
                        sh 'docker run -dp 5500:5432 --rm --name dbTest -e POSTGRES_PASSWORD=1234 -e POSGTGRES_USER=test postgres'
                        sh 'cat DATABASE_URL=postgres://test:1234@localhost:5500/test > .env'
                    }
                }
                 stage("Run 4 instances"){
                    steps{
                        sh 'pm2 start index.js -i 4'
                        sh 'pm2 ps'
                    }
                }
                stage("Test routes Without code 500"){
                    steps{
                        sh 'yarn test'
                    }
                }
                stage("Run Artillery during 20s"){
                    steps{
                        sh 'npx artillery run test/scen1.yml -c test/config.yml -o report-test1.json'
                        sh 'npx artillery report report-test1.json -o report-test1.html'
                    }
                }
            }
        }
    }
    post{
        always{
            sh 'docker stop dbTest'
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