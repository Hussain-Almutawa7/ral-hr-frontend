import { useState, useEffect } from "react";
import { getCompany, updateCompany } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const Company = ({user}) => {

    const [formData, setFormData] = useState({
        nameEn: "",
        nameAr: "",
        crNumber: "",
    })

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmiting, setIsSubmiting] = useState(false);

    const canEdit = user.role === "HR Manager";

    const loadCompany = async () => {
        try {
            setError("");

            const companyData = await getCompany();
            
            setFormData({
                nameEn: companyData.nameEn || "",
                nameAr: companyData.nameAr || "",
                crNumber: companyData.crNumber || "",
            });
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadCompany();
    }, []);

    const handleChange = e => {
        setFormData({...formData, [e.target.name] : e.target.value});
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmiting(true);
            setError("");
            setMessage("");

            const updatedCompany = await updateCompany(formData);

            setFormData({
                nameEn: updatedCompany.nameEn || "",
                nameAr: updatedCompany.nameAr || "",
                crNumber: updatedCompany.crNumber || ""
            });

            setMessage("Company updated sucessfully.")
            
        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmiting(false);
        }
    }

    if(isLoading) return <LoadingSpinner message="Loading company..." /> 

    return(
        <div>
            <h1>Company Settings</h1>

            <Message type="error">{error}</Message>
            <Message>{message}</Message>

            <form onSubmit={handleSubmit}>
                <label>
                    Company Name (English)
                    <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} disabled={!canEdit} />
                </label>

                <label>
                    Company Name (Arabic)
                    <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} disabled={!canEdit} />
                </label>

                <label>
                    CR Number
                    <input type="text" name="crNumber" value={formData.crNumber} onChange={handleChange} disabled={!canEdit} />
                </label>

                {canEdit && (
                    <div className="actions">
                        <Button type="submit" disabled={isSubmiting}>
                            {isSubmiting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Company;