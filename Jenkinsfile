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
        bat 'npm ci'
      }
    }

    stage('Build') {
      steps {
        bat 'npm run build'
      }
    }

    stage('Run tests') {
      steps {
        bat 'npm run test'
      }
    }

    stage('Run E2E tests') {
      steps {
        bat 'npm run test:e2e'
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
