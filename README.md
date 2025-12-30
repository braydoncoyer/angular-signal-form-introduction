# Angular Signal Forms Example

This project serves as a companion example for the blog post [How to Use Signal Forms in Angular](https://braydoncoyer.dev/blog/how-to-use-signal-forms-in-angular).

## Overview

This repository demonstrates how to use Angular's experimental Signal Forms API (`@angular/forms/signals`) to build reactive, type-safe forms. The example implements a flight booking form that showcases various Signal Forms features.

## Features Demonstrated

- **Signal-based form state** - Using `form()` and `signal()` for reactive form management
- **Built-in validators** - `required`, `minLength`, and `pattern` validators
- **Custom validators** - Creating reusable validation functions (`validSeatFormat`, `validFlightNumber`)
- **Cross-field validation** - Using `validateTree()` to validate that return date is after departure date
- **Dynamic form arrays** - Adding and removing flight entries with `applyEach()`
- **Conditional fields** - Return date field appears only when a return flight is added
- **Field directive** - Two-way binding with `[field]` directive
- **Error handling** - Displaying validation errors based on touched state

## Getting Started

### Prerequisites

- Node.js (v18+)
- Angular CLI

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

## Project Structure

```
src/app/
├── form/
│   ├── form.component.ts    # Main form logic with Signal Forms
│   ├── form.component.html  # Form template with [field] bindings
│   └── form.component.css   # Form styling
├── app.component.ts
└── app.routes.ts
```

## Key Concepts

### Creating a Signal Form

```typescript
bookingModel = signal<Booking>({ ... });

bookingForm = form(this.bookingModel, (root) => {
  required(root.passengerName, { message: 'Passenger name is required' });
  // ... more validators
});
```

### Custom Validators

```typescript
function validSeatFormat(field: SchemaPath<string>): void {
  return validate(field, (context) => {
    const value = context.value();
    // validation logic
  });
}
```

### Cross-field Validation

```typescript
validateTree(root, (context) => {
  const { departureDate, returnDate } = context.value();
  if (new Date(returnDate) <= new Date(departureDate)) {
    return {
      field: context.field.returnDate!,
      kind: 'return-after-departure',
      message: 'Return date must be after departure date',
    };
  }
  return undefined;
});
```

## Built With

- [Angular](https://angular.dev/) v21
- [@angular/forms/signals](https://angular.dev/) - Experimental Signal Forms API

## Resources

- [Blog Post: How to Use Signal Forms in Angular](https://braydoncoyer.dev/blog/how-to-use-signal-forms-in-angular)
- [Angular Documentation](https://angular.dev/)

## License

This project is open source and available for learning purposes.
