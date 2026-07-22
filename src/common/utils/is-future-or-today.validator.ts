import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsFutureOrToday(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureOrToday',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;

          const inputDate = new Date(value);
          if (isNaN(inputDate.getTime())) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          inputDate.setHours(0, 0, 0, 0);

          return inputDate >= today;
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot be in the past`;
        },
      },
    });
  };
}