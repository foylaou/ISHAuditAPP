"use client"
import {EnterpriseSelector} from "@/components/Selector/EnterpriseSelector";
import React, {useCallback, useState} from "react";

interface ContactForm {
    enterpriseId: string; // 添加 enterpriseId 以配合 EnterpriseSelector
    companyId: string;
    factoryId: string;
    name: string;
    department: string;
    job_title: string;
    phone_number: string;
    email: string;
    isActivate: boolean;
}

const initialForm: ContactForm = {
    enterpriseId: "", // 添加 enterpriseId 以配合 EnterpriseSelector
    companyId: "",
    factoryId: "",
    name: "",
    department: "",
    job_title: "",
    phone_number: "",
    email: "",
    isActivate: false,
};

export default function Page() {
    const [formData, setFormData] = useState<ContactForm>(initialForm);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => {
                const newData = { ...prev, [name]: value };

                switch (name) {
                    case "enterpriseId":
                        newData.companyId = "";
                        newData.factoryId = "";
                        break;
                    case "companyId":
                        newData.factoryId = "";
                        break;
                }

                return newData;
            });
        }, []
    );

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header text-base-content">
                            <h2>聯絡人資料設定</h2>
                            <EnterpriseSelector

                                formData={formData}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
