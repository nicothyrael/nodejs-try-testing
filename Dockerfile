FROM docker-registry.tools.expedia.com/stratus/primer-base-expressjs:4.2.2-1.0.0

# When this Dockerfile is built (with "docker build .") the base "primer-base-expressjs" image will:
# - Copy files from this directory into /app on the image
# - Run npm install from /app

# When resulting image is run (with "docker run"):
# - Set $NODE_ENV equal to $EXPEDIA_ENVIRONMENT (defaults to "dev", set it with "-e EXPEDIA_ENVIRONMENT=<env>")
# - Start the app with "npm start
