# SG Technical Test

---

```bash
# Install packages
yarn
# Run dev server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Task

We have set up this partial simple invoice project for you to complete.
Below is a list of tasks that we would like you to complete.

The tech stack is simple, using what we normally use on our projects, [NextJS](https://nextjs.org/docs) and [Chakra](https://chakra-ui.com/docs/components) for the UI.

You are free to add any other additional packages you require and can edit/refactor any of the existing code to complete any of the tasks.

Completed!

- [x] The `/api/invoices` is incomplete, please add the following:

  - [x] Sort the api by invoice number
  - [x] Add a discount of 10% to all invoices that are unpaid and are more than $100 in total (price on the invoice is in cents)
  - [x] Make sure that if there are no results that an appropriate status code is sent back
  - [x] Create a test for the API and test all cases

- [x] Add an `Amount` column to table to display the total value of the invoice

- [x] Calculate the totals for `Invoice Total`, `Total Paid` and `Total Owed`

- [x] Add a feature that enables the user to delete invoices that have not been paid, user should get a prompt to confirm before deleting the item

- [x] Format all dates `dd-mm-yyyy`

- [x] Currency is give in cents, format them as `$00.00`

- [x] Highlight alternate rows

- [x] Highlight table rows with unpaid invoices in red

- [x] Fix the table with the totals to look like the one designed, floating to the right

- [x] If there is a discount, display the discounted price in the table and highlight the amount in green.

- [x] Add the `Discount` to the totals table at the bottom panel

- [x] Mobile - fix the invoice # column to be sticky on the left side when table scrolls horizontally

---

## Designs

![Screenshot](./public/designs/design-invice-list.png)
![Screenshot](./public/designs/design-invice-list-delete.png)
