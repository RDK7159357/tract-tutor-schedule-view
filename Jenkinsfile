pipeline {
    agent any
    
    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPOSITORY = 'track-tutor-backend'
        EC2_INSTANCE = 'ec2-13-201-28-122.ap-south-1.compute.amazonaws.com'
        S3_BUCKET = 'track-tutor-frontend'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    // Check if we're on Ubuntu/Debian or Amazon Linux
                    def osCheck = sh(script: 'cat /etc/os-release | grep -i ubuntu || echo "not-ubuntu"', returnStdout: true).trim()
                    
                    if (osCheck.contains('ubuntu') || osCheck.contains('debian')) {
                        // Install Node.js 18 on Ubuntu/Debian
                        sh '''
                            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                            node -v
                            npm -v
                        '''
                    } else {
                        // For Amazon Linux or other systems, use NVM
                        sh '''
                            # Install NVM if not already installed
                            if [ ! -d "$HOME/.nvm" ]; then
                                curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                            fi
                            
                            # Load NVM
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            
                            # Install Node.js 16 (compatible with older glibc)
                            nvm install 16.20.2
                            nvm use 16.20.2
                            nvm alias default 16.20.2
                            
                            # Verify installation
                            node -v
                            npm -v
                        '''
                    }
                }

                // Install frontend dependencies
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    npm install
                '''

                // Install backend dependencies
                dir('backend') {
                    sh '''
                        export NVM_DIR="$HOME/.nvm"
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        npm install
                    '''
                }
            }
        }
        
        stage('Lint') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    npm run lint || true
                '''
            }
        }
        
        stage('Build Frontend') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    npm run build
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    npm test || true
                '''
            }
        }
        
        stage('Deploy Frontend to S3') {
            when {
                branch 'main'
            }
            steps {
                // Deploy frontend to S3
                sh 'aws s3 sync dist/ s3://${S3_BUCKET} --delete'
                
                // Uncomment if you're using CloudFront
                // sh 'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"'
            }
        }
        
        stage('Build and Push Backend Docker Image') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Login to AWS ECR
                    sh 'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com'
                    
                    // Build and push backend image
                    sh '''
                        docker build -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER} -f backend/Dockerfile backend/
                        docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER}
                    '''
                }
            }
        }
        
        stage('Deploy Backend to EC2') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // SSH into EC2 and update the container
                    withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'keyFile')]) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no -i ${keyFile} ec2-user@${EC2_INSTANCE} "
                                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com && \
                                docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER} && \
                                docker stop track-tutor-backend || true && \
                                docker rm track-tutor-backend || true && \
                                docker run -d --name track-tutor-backend -p 3000:3000 \
                                    -e NODE_ENV=production \
                                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER}
                            "
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}