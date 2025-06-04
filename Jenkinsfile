pipeline {
    agent any
    
    tools {
        nodejs 'Node18'
    }
    
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
                sh 'npm install'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint || true'
            }
        }
        
        stage('Build Frontend') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }
        
        stage('Deploy Frontend to S3') {
            when {
                branch 'main'
            }
            steps {
                // Deploy frontend to S3
                sh 'aws s3 sync dist/ s3://${S3_BUCKET} --delete'
                
                // Invalidate CloudFront cache if you're using CloudFront
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
                            ssh -i ${keyFile} ${EC2_INSTANCE} '
                                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com && \
                                docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER} && \
                                docker stop track-tutor-backend || true && \
                                docker rm track-tutor-backend || true && \
                                docker run -d --name track-tutor-backend -p 3000:3000 \
                                    -e NODE_ENV=production \
                                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${BUILD_NUMBER}'
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
    }
}