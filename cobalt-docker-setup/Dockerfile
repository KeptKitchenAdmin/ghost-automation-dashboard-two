FROM ghcr.io/imputnet/cobalt:latest

# Switch to root temporarily to set permissions
USER root

# Add startup script with correct permissions
COPY --chmod=755 startup.sh /startup.sh

# Set environment variables with defaults
ENV COOKIE_PATH=/cookies.json
ENV PORT=9000

# Switch back to the original user
USER 1000

# Use our startup script as entrypoint
ENTRYPOINT ["/startup.sh"]