FROM node:18

WORKDIR /app

# Copy all microservices including their .env files
COPY ./user-service ./user-service
COPY ./appointment-service ./appointment-service
COPY ./review-service ./review-service
COPY ./doctor-service ./doctor-service
COPY ./payment-service ./payment-service

COPY ecosystem.config.js ./

# Install dependencies for each service
RUN cd user-service && npm install
RUN cd appointment-service && npm install
RUN cd review-service && npm install
RUN cd doctor-service && npm install
RUN cd payment-service && npm install

# Install pm2 globally to run multiple Node.js processes
RUN npm install -g pm2

# Expose ports for all services
EXPOSE 8001 8002 8003 8004 8005

# Start all services concurrently with pm2
CMD ["pm2-runtime", "ecosystem.config.js"]
