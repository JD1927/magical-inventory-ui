# Build stage
FROM node:22-alpine AS build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application for production
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy the built application from the build stage
# Angular 17+ with the new application builder outputs to dist/<project-name>/browser
COPY --from=build /app/dist/magical-inventory-ui/browser /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
