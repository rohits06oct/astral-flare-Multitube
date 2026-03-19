# Use the official Microsoft Playwright image as the base
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install root dependencies
RUN npm install

# Install automation dependencies
RUN cd automation && npm install

# Install browsers and their system dependencies
# This is pre-baked in the image, but good to ensure latest/needed
RUN npx playwright install --with-deps

# Create output directories just in case
RUN mkdir -p automation/test-results automation/playwright-report

# Expose the default server port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
