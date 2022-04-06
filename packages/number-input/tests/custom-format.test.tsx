/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  act,
  fireEvent,
  render,
  userEvent,
  screen,
} from "@chakra-ui/test-utils"
import * as React from "react"

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from "../src"

function renderComponent(props: NumberInputProps = {}) {
  return render(
    <>
      <label htmlFor="input">Select number:</label>
      <NumberInput id="input" data-testid="root" {...props}>
        <NumberInputField data-testid="input" />
        <NumberInputStepper data-testid="group">
          <NumberIncrementStepper children="+" data-testid="up-btn" />
          <NumberDecrementStepper children="-" data-testid="down-btn" />
        </NumberInputStepper>
      </NumberInput>
    </>,
  )
}

const CUSTOM_FLOATING_POINT_REGEX = /^[Ee0-9+\-.,]$/
const testNumberInputCustomFormat = {
  isValidCharacter: (v: string) => CUSTOM_FLOATING_POINT_REGEX.test(v),
  parse: (value: string) => value?.replace(",", "."),
  format: (value: string | number) => {
    if (!value) return value.toString()
    return value.toString().replace(".", ",")
  },
}

it("should apply custom format", async () => {
  renderComponent({
    defaultValue: 0,
    step: 0.65,
    precision: 2,
    ...testNumberInputCustomFormat,
  })

  const input = screen.getByTestId("input")
  const incBtn = screen.getByTestId("up-btn")
  const decBtn = screen.getByTestId("down-btn")

  expect(input).toHaveValue("0,00")
  await userEvent.click(incBtn)
  expect(input).toHaveValue("0,65")
  await userEvent.click(incBtn)
  expect(input).toHaveValue("1,30")
  await userEvent.click(incBtn)
  expect(input).toHaveValue("1,95")
  await userEvent.click(decBtn)
  expect(input).toHaveValue("1,30")

  // on blur, value is clamped using precision
  await userEvent.type(input, "1234")
  expect(input).toHaveValue("1,301234")
  act(() => {
    fireEvent.blur(input)
  })
  expect(input).toHaveValue("1,30")
})
