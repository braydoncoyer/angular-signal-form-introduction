// import { JsonPipe } from '@angular/common';
// import { Component, computed, signal } from '@angular/core';
// import { form, Field, required, minLength, validate, SchemaPath, applyEach, type ValidationError, type FieldTree } from '@angular/forms/signals'

// interface Booking {
//   passengerName: string;
//   flights: Array<{
//     id: string;
//     flightNumber: string;
//     seatNumber: string;
//     aircraft: {
//       model: string;
//       capacity: number;
//     };
//     class: string;
//     amount: number;
//   }>;
// }

// function validSeatFormat(field: SchemaPath<string>): void {
//   return validate(field, (context) => {
//     const value = context.value();

//     if (!value || typeof value !== 'string') return undefined;

//     // Seat must be letter A-F followed by 1-2 digits
//     const seatPattern = /^[A-F]\d{1,2}$/;

//     if (!seatPattern.test(value)) {
//       return {
//         kind: 'invalid-seat-format',
//         message: 'Seat must be in format like A12 or F5',
//       };
//     }

//     return undefined;
//   });
// }

// function validFlightNumber(field: SchemaPath<string>): void {
//   return validate(field, (context) => {
//     const value = context.value();

//     if (!value || typeof value !== 'string') return undefined;

//     // Flight number must be two uppercase letters followed by at least 3 digits
//     const flightPattern = /^[A-Z]{2}\d{3,}$/;

//     if (!flightPattern.test(value)) {
//       return {
//         kind: 'invalid-flight-number',
//         message: 'Flight number must be 2 letters followed by at least 3 digits (e.g., AA123)',
//       };
//     }

//     return undefined;
//   });
// }

// @Component({
//   selector: 'app-form',
//   imports: [Field, JsonPipe],
//   templateUrl: './form.component.html',
//   styleUrl: './form.component.css',
// })
// export class FormComponent {
//   flightClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];

//   bookingModel = signal<Booking>({
//     passengerName: '',
//     flights: [
//       {
//         id: crypto.randomUUID(),
//         flightNumber: '',
//         seatNumber: '',
//         aircraft: { model: '', capacity: 0 },
//         class: '',
//         amount: 0,
//       },
//     ],
//   });

//   bookingForm = form(this.bookingModel, (root) => {
//     required(root.passengerName, {
//       message: 'Passenger name is required',
//     });
//     minLength(root.passengerName, 2, {
//       message: 'Name must be at least 2 characters',
//     });

//     applyEach(root.flights, (flight) => {
//       required(flight.flightNumber, { message: 'Flight number is required' });
//       validFlightNumber(flight.flightNumber);
//       required(flight.seatNumber, { message: 'Seat number is required' });
//       validSeatFormat(flight.seatNumber);
//       required(flight.aircraft.model, { message: 'Aircraft model is required' });
//       required(flight.aircraft.capacity, { message: 'Capacity is required' });
//       required(flight.class, { message: 'Class is required' });
//       required(flight.amount, { message: 'Amount is required' });
//     });
//   });

//   isFormInvalid = computed(() => this.bookingForm().invalid());

//   submitForm() {
//     console.log(this.bookingForm().value());
//   }

//   // Helper method to get errors if field is touched
//   getErrors(field: FieldTree<unknown>): ValidationError[] {
//     return field().touched() ? field().errors() : [];
//   }

//   addFlight() {
//     this.bookingModel.update((booking) => ({
//       ...booking,
//       flights: [
//         ...booking.flights,
//         {
//           id: crypto.randomUUID(),
//           flightNumber: '',
//           seatNumber: '',
//           aircraft: { model: '', capacity: 0 },
//           class: '',
//           amount: 0,
//         },
//       ],
//     }));
//   }

//   removeFlight(index: number) {
//     this.bookingModel.update((booking) => ({
//       ...booking,
//       flights: booking.flights.filter((_, i) => i !== index),
//     }));
//   }
// }

import { JsonPipe } from '@angular/common';
import { Component, computed, Signal, signal } from '@angular/core';
import { Form } from '@angular/forms';
import {
  form,
  Field,
  required,
  minLength,
  validate,
  validateTree,
  pattern,
  SchemaPath,
  applyEach,
  type ValidationError,
  type FieldTree,
} from '@angular/forms/signals';

interface Booking {
  passengerName: string;
  departureDate: string;
  returnDate?: string; // Optional - only when return flight exists
  flights: Array<{
    id: string;
    flightNumber: string;
    seatNumber: string;
    aircraft: {
      model: string;
      capacity: number;
    };
    class: string;
    amount: number;
  }>;
}

function validSeatFormat(field: SchemaPath<string>): void {
  return validate(field, (context) => {
    const value = context.value();

    if (!value || typeof value !== 'string') return undefined;

    // Seat must be letter A-F followed by 1-2 digits
    const seatPattern = /^[A-F]\d{1,2}$/;

    if (!seatPattern.test(value)) {
      return {
        kind: 'invalid-seat-format',
        message: 'Seat must be in format like A12 or F5',
      };
    }

    return undefined;
  });
}

function validFlightNumber(field: SchemaPath<string>): void {
  return validate(field, (context) => {
    const value = context.value();

    if (!value || typeof value !== 'string') return undefined;

    // Flight number must be two uppercase letters followed by at least 3 digits
    const flightPattern = /^[A-Z]{2}\d{3,}$/;

    if (!flightPattern.test(value)) {
      return {
        kind: 'invalid-flight-number',
        message:
          'Flight number must be 2 letters followed by at least 3 digits (e.g., AA123)',
      };
    }

    return undefined;
  });
}

@Component({
  selector: 'app-form',
  imports: [Field, JsonPipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
})
export class FormComponent {
  public flightClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];

  public bookingModel = signal<Booking>({
    passengerName: '',
    departureDate: '',
    // returnDate only added when return flight is added
    flights: [
      {
        id: crypto.randomUUID(),
        flightNumber: '',
        seatNumber: '',
        aircraft: { model: '', capacity: 0 },
        class: '',
        amount: 0,
      },
    ],
  });

  public bookingForm = form(this.bookingModel, (root) => {
    required(root.passengerName, {
      message: 'Passenger name is required',
    });
    minLength(root.passengerName, 2, {
      message: 'Name must be at least 2 characters',
    });
    required(root.departureDate, {
      message: 'Departure date is required',
    });

    // Only validate returnDate if it exists (when return flight is added)
    if (root.returnDate) {
      required(root.returnDate, {
        message: 'Return date is required',
      });

      // Cross-field validation for dates
      validateTree(root, (context) => {
        const { departureDate, returnDate } = context.value();

        if (
          departureDate &&
          returnDate &&
          new Date(returnDate) <= new Date(departureDate)
        ) {
          return {
            field: context.field.returnDate!,
            kind: 'return-after-departure',
            message: 'Return date must be after departure date',
          };
        }

        return undefined;
      });
    }

    applyEach(root.flights, (flight) => {
      required(flight.flightNumber, { message: 'Flight number is required' });
      validFlightNumber(flight.flightNumber);
      required(flight.seatNumber, { message: 'Seat number is required' });
      validSeatFormat(flight.seatNumber);
      required(flight.aircraft.model, {
        message: 'Aircraft model is required',
      });
      required(flight.aircraft.capacity, { message: 'Capacity is required' });
      required(flight.class, { message: 'Class is required' });
      required(flight.amount, { message: 'Amount is required' });
    });
  });

  public isFormInvalid: Signal<boolean> = computed(() => this.bookingForm().invalid());

  public submitForm(): void {
    if (this.bookingForm().valid()) {
      console.log('Booking submitted:', this.bookingModel());
    }
  }

  // Helper method to get errors if field is touched
  public getErrors(field: FieldTree<unknown>): ValidationError[] {
    return field().touched() ? field().errors() : [];
  }

  public addFlight(): void {
    this.bookingModel.update((booking) => ({
      ...booking,
      returnDate: '', // Add return date field when adding return flight
      flights: [
        ...booking.flights,
        {
          id: crypto.randomUUID(),
          flightNumber: '',
          seatNumber: '',
          aircraft: { model: '', capacity: 0 },
          class: '',
          amount: 0,
        },
      ],
    }));
  }

  public removeFlight(index: number): void {
    this.bookingModel.update((booking) => {
      const updatedBooking = {
        ...booking,
        flights: booking.flights.filter((_, i) => i !== index),
      };

      // Remove returnDate if removing the return flight
      if (updatedBooking.flights.length === 1) {
        delete updatedBooking.returnDate;
      }

      return updatedBooking;
    });
  }
}