import React, { useState, useEffect } from 'react'
import { CheckboxGroup } from "@heroui/react"
import { CustomCheckbox } from './CustomCheckbox'

export default function CheckTypeList({ addonType, setAddonType }) {
    const [groupSelected, setGroupSelected] = useState([])

    useEffect(() => {
        setGroupSelected(addonType ? [addonType] : [])
    }, [addonType])

    const isDisabled = groupSelected.length > 0

    const handleCheckboxChange = (newSelected) => {
        const selectedValue = newSelected.length > 1 ? newSelected.slice(-1) : newSelected
        setGroupSelected(selectedValue)
        setAddonType(selectedValue[0] || '')
    }

    return (
        <div className="flex items-start justify-start w-auto gap-1 p-2 mt-0">
            <CheckboxGroup
                color="primary"
                className="gap-1"
                label="Select addonsType"
                orientation="horizontal"
                value={groupSelected}
                onChange={handleCheckboxChange}
            >
                <CustomCheckbox
                    value="Chat"
                    isDisabled={isDisabled && !groupSelected.includes('Chat')}
                >
                    Chat
                </CustomCheckbox>
                <CustomCheckbox
                    value="Utility"
                    isDisabled={isDisabled && !groupSelected.includes('Utility')}
                >
                    Utility
                </CustomCheckbox>
                <CustomCheckbox
                    value="PvP"
                    isDisabled={isDisabled && !groupSelected.includes('PvP')}
                >
                    PvP
                </CustomCheckbox>
                <CustomCheckbox
                    value="Map"
                    isDisabled={isDisabled && !groupSelected.includes('Map')}
                >
                    Map
                </CustomCheckbox>
                <CustomCheckbox value="UI" isDisabled={isDisabled && !groupSelected.includes('UI')}>
                    UI
                </CustomCheckbox>
                <CustomCheckbox
                    value="Mounts"
                    isDisabled={isDisabled && !groupSelected.includes('Mounts')}
                >
                    Mounts
                </CustomCheckbox>
                <CustomCheckbox
                    value="Transmog"
                    isDisabled={isDisabled && !groupSelected.includes('Transmog')}
                >
                    Transmog
                </CustomCheckbox>
            </CheckboxGroup>
        </div>
    )
}
