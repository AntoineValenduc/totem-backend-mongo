pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
  }

  options {
    skipDefaultCheckout(false)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Run tests') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Run E2E tests') {
      steps {
        sh 'npm run test:e2e'
      }
    }
  }

  post {
    always {
      echo '🏁 Pipeline terminée'
    }
    failure {
      echo '❌ Échec de la pipeline'
    }
    success {
      echo '✅ Succès !'
    }
  }
}
