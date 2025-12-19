Inventory Search Web App (CSV-based)

This project is a lightweight, browser-based inventory search application built with HTML, JavaScript, and PHP, designed to run on a standard web host with FTP access only.

The application allows users to search products stored in a CSV file without requiring a database or backend framework. Each product can have:

One internal item number

Multiple supplier/vendor item numbers

A free-text description

The search works across all of these fields and returns results instantly in the browser.

Key Features

CSV-driven data source
Products are loaded from a single varer.csv file (semicolon-separated). No database is required.

Fast client-side search
All searching is performed in the browser for quick response, even with large files.

Multiple item numbers per product
Supports one internal SKU and multiple vendor numbers per item.

Mobile-friendly UI
Responsive layout optimized for both desktop and mobile devices.

Simple access control (date-based)
A lightweight, client-side date password (DDMMYYYY) is used to prevent casual access.
This is intentionally not high-security authentication, but a practical barrier for internal use.

Web-based CSV management
An optional PHP upload page allows:

Downloading the current varer.csv as a template

Uploading a new CSV file to replace the existing one

Automatic backup of previous CSV versions

No dependencies on databases or frameworks
Runs on any basic hosting that supports static files and PHP.

Intended Use

This project is well suited for:

Internal inventory lookup

Warehouse or workshop item searches

Supplier part number cross-referencing

Lightweight tools where simplicity and portability matter more than strict security

It is not intended for public or high-security environments.

Technology Stack

HTML / CSS (UI)

Vanilla JavaScript (search logic)

PHP (CSV upload/download)

CSV file as the single data source

Deployment

Upload files via FTP

Requires HTTPS for best browser compatibility

Works on common shared hosting environments
