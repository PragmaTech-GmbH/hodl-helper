# Use the official lightweight Nginx image based on Alpine Linux
FROM nginx:1.27-alpine-slim

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static website files into the Nginx web root
COPY index.html /usr/share/nginx/html/

# Expose port 8080 (the port Nginx will listen on inside the container)
EXPOSE 8080

# The base Nginx image already has a CMD to start Nginx in the foreground
# CMD ["nginx", "-g", "daemon off;"]