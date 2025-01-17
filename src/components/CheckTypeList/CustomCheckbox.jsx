import { useCheckbox, Chip, VisuallyHidden, tv } from "@heroui/react"
import { CheckIcon } from './CheckIcon.jsx'

const checkbox = tv({
    slots: {
        base: 'border-default hover:bg-primary',
        content: 'text-default-500'
    },
    variants: {
        isSelected: {
            true: {
                base: 'border-primary bg-primary hover:bg-primary-500 hover:border-primary-500',
                content: 'text-primary-foreground pl-1'
            }
        },
        isFocusVisible: {
            true: {
                base: 'outline-none ring-2 ring-focus ring-offset-2 ring-offset-background'
            }
        }
    }
})

export const CustomCheckbox = (props) => {
    const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } =
        useCheckbox({
            ...props
        })

    const styles = checkbox({ isSelected, isFocusVisible })

    return (
        <label {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} disabled={props.isDisabled} />
            </VisuallyHidden>
            <Chip
                classNames={{
                    base: styles.base(),
                    content: styles.content()
                }}
                color="primary"
                radius="sm"
                size="sm"
                startContent={isSelected ? <CheckIcon className="ml-1" /> : null}
                variant="bordered"
                {...getLabelProps()}
            >
                {children ? children : isSelected ? 'Enabled' : 'Disabled'}
            </Chip>
        </label>
    )
}
