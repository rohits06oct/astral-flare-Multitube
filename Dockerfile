# Use the official Microsoft Playwright image as the base
FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Set working directory
WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies in the automation folder where playwright is defined
RUN cd automation && npm install

# Install browsers and their system dependencies
# This ensures that the environment is fully ready
RUN npx playwright install --with-deps

# Create output directories for reports
RUN mkdir -p automation/test-results automation/playwright-report

# Expose the default server port
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
