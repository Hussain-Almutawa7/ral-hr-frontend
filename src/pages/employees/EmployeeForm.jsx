import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { createEmployee, updateEmployee, getEmployeeById, getAllEmployees } from "../../services/employeeService";
import { getAllDepartments, getAllDesignation, getAllBanks, getAllHolidayLists, getAllShiftTypes } from "../../services/settingsService";

import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Message from "../../components/common/Message";

const EmployeeForm = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();

    const isEdit = Boolean(employeeId);

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [banks, setBanks] = useState([]);
    const [holidayLists, setHolidayLists] = useState([]);
    const [shiftTypes, setShiftTypes] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employeeCode: "",
        nameEn: "",
        nameAr: "",
        cprNumber: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        isBahraini: "",
        workerCategory: "",
        department: "",
        designation: "",
        reportsTo: "",
        dateOfJoining: "",
        probationEndDate: "",
        employmentType: "",
        iban: "",
        bankName: "",
        mobile: "",
        emailPersonal: "",
        emailWork: "",
        holidayList: "",
        shiftType: ""
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadFormData = async () => {
        try {
            setError("");

            const departmentData = await getAllDepartments();
            setDepartments(departmentData);

            const designationData = await getAllDesignation();
            setDesignations(designationData);

            const bankData = await getAllBanks();
            setBanks(bankData);

            const holidayListData = await getAllHolidayLists();
            setHolidayLists(holidayListData);

            const shiftTypeData = await getAllShiftTypes();
            setShiftTypes(shiftTypeData);

            const employeeData = await getAllEmployees();
            setEmployees(employeeData);

            if (isEdit) {
                const employee = await getEmployeeById(employeeId);

                setFormData({
                    employeeCode: employee.employeeCode || "",
                    nameEn: employee.nameEn || "",
                    nameAr: employee.nameAr || "",
                    cprNumber: employee.cprNumber || "",
                    dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split("T")[0] : "",
                    gender: employee.gender || "",
                    nationality: employee.nationality || "",
                    isBahraini: employee.isBahraini,
                    workerCategory: employee.workerCategory || "",
                    department: employee.department?._id || employee.department || "",
                    designation: employee.designation?._id || employee.designation || "",
                    reportsTo: employee.reportsTo?._id || employee.reportsTo || "",
                    dateOfJoining: employee.dateOfJoining ? employee.dateOfJoining.split("T")[0] : "",
                    probationEndDate: employee.probationEndDate ? employee.probationEndDate.split("T")[0] : "",
                    employmentType: employee.employmentType || "",
                    iban: employee.iban || "",
                    bankName: employee.bankName?._id || employee.bankName || "",
                    mobile: employee.mobile || "",
                    emailPersonal: employee.emailPersonal || "",
                    emailWork: employee.emailWork || "",
                    holidayList: employee.holidayList?._id || employee.holidayList || "",
                    shiftType: employee.shiftType?._id || employee.shiftType || ""
                });
            }

        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadFormData();
    }, [employeeId]);

    const handleChange = e => {
        if (e.target.name === "isBahraini") {
            setFormData({ ...formData, isBahraini: e.target.value === "true" });
            return;
        }

        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            const employeeData = {
                ...formData,
                department: formData.department || null,
                designation: formData.designation || null,
                reportsTo: formData.reportsTo || null,
                probationEndDate: formData.probationEndDate || null,
                emailPersonal: formData.emailPersonal || null,
                emailWork: formData.emailWork || null,
                shiftType: formData.shiftType || null
            };

            if (isEdit) {
                await updateEmployee(employeeId, employeeData);
                navigate(`/employees/${employeeId}`);
            } else {
                employeeData.status = "Active";
                const createdEmployee = await createEmployee(employeeData);
                navigate(`/employees/${createdEmployee._id}`);
            }

        } catch (e) {
            setError(e.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) return <LoadingSpinner message={isEdit ? "Loading employee..." : "Loading employee form..."} />

    return (
        <div>
            <h1>{isEdit ? "Edit Employee" : "Add Employee"}</h1>

            <Message type="error">{error}</Message>

            <form onSubmit={handleSubmit}>

                <section className="details-section">
                    <h2>Personal Information</h2>

                    <div className="employee-form-grid">
                        <label>
                            Employee Code
                            <input type="text" name="employeeCode" value={formData.employeeCode} onChange={handleChange} required />
                        </label>

                        <label>
                            Name (English)
                            <input type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} required />
                        </label>

                        <label>
                            Name (Arabic)
                            <input type="text" name="nameAr" value={formData.nameAr} onChange={handleChange} required />
                        </label>

                        <label>
                            CPR Number
                            <input type="text" name="cprNumber" value={formData.cprNumber} onChange={handleChange} maxLength="9" pattern="[0-9]{9}" required />
                        </label>

                        <label>
                            Date of Birth
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        </label>

                        <label>
                            Gender
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </label>

                        <label>
                            Nationality
                            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} required />
                        </label>

                        <label>
                            Bahraini
                            <select name="isBahraini" value={formData.isBahraini === "" ? "" : String(formData.isBahraini)} onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </label>

                        <label>
                            Worker Category
                            <select name="workerCategory" value={formData.workerCategory} onChange={handleChange} required>
                                <option value="">Select Worker Category</option>
                                <option value="Bahraini">Bahraini</option>
                                <option value="GCC National">GCC National</option>
                                <option value="Expatriate">Expatriate</option>
                            </select>
                        </label>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Employment Information</h2>

                    <div className="employee-form-grid">
                        <label>
                            Department
                            <select name="department" value={formData.department} onChange={handleChange}>
                                <option value="">No Department</option>

                                {departments.filter(department => department.isActive).map(department => (
                                    <option key={department._id} value={department._id}>
                                        {department.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Designation
                            <select name="designation" value={formData.designation} onChange={handleChange}>
                                <option value="">No Designation</option>

                                {designations.filter(designation => designation.isActive).map(designation => (
                                    <option key={designation._id} value={designation._id}>
                                        {designation.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Reports To
                            <select name="reportsTo" value={formData.reportsTo} onChange={handleChange}>
                                <option value="">No Reporting Manager</option>

                                {employees.filter(employee => employee._id !== employeeId).map(employee => (
                                    <option key={employee._id} value={employee._id}>
                                        {employee.employeeCode} - {employee.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Date of Joining
                            <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} required />
                        </label>

                        <label>
                            Probation End Date
                            <input type="date" name="probationEndDate" value={formData.probationEndDate} onChange={handleChange} />
                        </label>

                        <label>
                            Employment Type
                            <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                                <option value="">Select Employment Type</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Fixed Term">Fixed Term</option>
                            </select>
                        </label>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Work Setup</h2>

                    <div className="employee-form-grid">
                        <label>
                            Holiday List
                            <select name="holidayList" value={formData.holidayList} onChange={handleChange} required>
                                <option value="">Select Holiday List</option>

                                {holidayLists.map(list => (
                                    <option key={list._id} value={list._id}>
                                        {list.name} ({list.year})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Default Shift Type
                            <select name="shiftType" value={formData.shiftType} onChange={handleChange}>
                                <option value="">No Default Shift</option>

                                {shiftTypes.filter(type => type.isActive).map(type => (
                                    <option key={type._id} value={type._id}>
                                        {type.shiftName}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Bank Information</h2>

                    <div className="employee-form-grid">
                        <label>
                            Bank
                            <select name="bankName" value={formData.bankName} onChange={handleChange} required>
                                <option value="">Select Bank</option>

                                {banks.filter(bank => bank.isActive).map(bank => (
                                    <option key={bank._id} value={bank._id}>
                                        {bank.nameEn}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            IBAN
                            <input type="text" name="iban" value={formData.iban} onChange={handleChange} maxLength="22" placeholder="BH..." required />
                        </label>
                    </div>
                </section>


                <section className="details-section">
                    <h2>Contact Information</h2>

                    <div className="employee-form-grid">
                        <label>
                            Mobile
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} maxLength="8" pattern="3[0-9]{7}" required />
                        </label>

                        <label>
                            Personal Email
                            <input type="email" name="emailPersonal" value={formData.emailPersonal} onChange={handleChange} />
                        </label>

                        <label>
                            Work Email
                            <input type="email" name="emailWork" value={formData.emailWork} onChange={handleChange} />
                        </label>
                    </div>
                </section>


                <div className="actions page-actions">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Employee"}
                    </Button>

                    <Button variant="secondary" onClick={() => isEdit ? navigate(`/employees/${employeeId}`) : navigate("/employees")}>
                        Cancel
                    </Button>
                </div>

            </form>
        </div>
    )
}

export default EmployeeForm;