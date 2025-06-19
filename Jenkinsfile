pipeline {
  agent any

  environment {
    NODE_ENV = 'test'
    SONAR_TOKEN = credentials('sonarqube_token')
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

    stage('ESLint') {
      steps {
        bat 'npm run lint'
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

    stage('Run E2E Gateway') {
      steps {
        bat 'npm run test:e2eApi'
      }
    }

    stage('Run E2E Mongo') {
      steps {
        bat 'npm run test:e2eMongo'
      }
    }

    stage('Run E2E Sql') {
      steps {
        bat 'npm run test:e2eSql'
      }
    }

    stage('Debug reports') {
      steps {
        bat 'dir /s'
      }
    }

    stage('SonarCloud') {
      steps {
        bat 'npm run test:coverage'
        bat 'npx sonarqube-scanner'
      }
    }
  }

  post {
    always {
      echo '🏁 Pipeline terminée'

      // Pour chaque microservice
      junit 'apps/totem-api-gateway/reports/junit/*.xml'
      junit 'apps/totem-mongo/reports/junit/*.xml'
      junit 'apps/totem-auth-sql/reports/junit/*.xml'

      // Archive la couverture
      archiveArtifacts artifacts: '**/coverage/**/*', allowEmptyArchive: true
    }

    failure {
      echo '❌ Échec de la pipeline'
    }

    success {
      echo '✅ Succès !'
    }
  }
}
