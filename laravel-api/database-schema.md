```dbml
// Database Schema for Company Directory Platform
// Generated: August 6, 2025

// Enums
Enum UserRole {
  superAdmin
  owner
  user [note: 'Default role']
}

Enum ServiceType {
  service
  product
}

// Main Business Tables
Table users {
  id bigint [primary key, increment]
  username varchar [unique, not null]
  email varchar [unique, not null]
  password varchar [not null, note: 'Hashed password']
  role UserRole [default: 'user', note: 'User role in the system']
  created_at timestamp
  updated_at timestamp
}

Table companies {
  id bigint [primary key, increment]
  name varchar [not null]
  description text [null, note: 'Company description']
  owner_id bigint [ref: > users.id, not null, note: 'Company owner']
  created_at timestamp
  updated_at timestamp
}

Table services_or_products {
  id bigint [primary key, increment]
  name varchar [not null]
  description text [null]
  price decimal(8,2) [not null, note: 'Price with 2 decimal places']
  type ServiceType [not null]
  company_id bigint [ref: > companies.id, not null]
  created_at timestamp
  updated_at timestamp
}

Table blogs {
  id bigint [primary key, increment]
  title varchar [not null]
  content text [not null]
  user_id bigint [ref: > users.id, not null, note: 'Blog author']
  created_at timestamp
  updated_at timestamp
}

Table comments {
  id bigint [primary key, increment]
  content text [not null]
  user_id bigint [ref: > users.id, not null, note: 'Comment author']
  blog_id bigint [ref: > blogs.id, not null, note: 'Parent blog post']
  created_at timestamp
  updated_at timestamp
}

// Relationships with cascade delete
Ref: users.id < companies.owner_id [delete: cascade, note: 'User owns companies']
Ref: users.id < blogs.user_id [delete: cascade, note: 'User writes blogs']
Ref: users.id < comments.user_id [delete: cascade, note: 'User writes comments']
Ref: companies.id < services_or_products.company_id [delete: cascade, note: 'Company has services/products']
Ref: blogs.id < comments.blog_id [delete: cascade, note: 'Blog has comments']

// Notes
Note: '''
Business Rules:
1. When a user registers a company, their role can be upgraded to 'owner'
2. SuperAdmin has full access to all data and admin functions
3. Owners can manage their own companies and services/products
4. Regular users can browse companies and comment on blogs
5. All foreign keys use CASCADE DELETE for data integrity
'''
```
