import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCustomer,
  updateCustomer,
  fetchCustomerById,
} from "../../application/useCases/CustomerUseCases";
import { Customer } from "../../domain/models/Customer";
import { handleError } from "../../utils/ErrorUtils";

interface CustomerFormProps {
  onSubmit?: (customer: Customer) => void;
}

/**
 * A React component that displays a form to create or update a customer.
 *
 * @remarks
 * The component handles fetching the customer for editing or creating a new one,
 * with enhanced error handling and validation of the form fields.
 */
export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [availableCredit, setAvailableCredit] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches a customer by their ID, if one is present in the URL,
     * and updates the form fields with the customer data.
     *
     * If the customer is not found, sets an error message.
     * In any case, sets the loading state to false.
     */
    const loadCustomer = async () => {
      if (id) {
        try {
          const customer = await fetchCustomerById(id);
          setName(customer.name);
          setEmail(customer.email);
          setAvailableCredit(customer.availableCredit);
        } catch (err: any) {
          setError(handleError(err, "Failed to load customer data."));
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const validateForm = useCallback(() => {
    if (!name || !email || availableCredit < 0) {
      setError("Please fill out all fields with valid data.");
      return false;
    }
    return true;
  }, [name, email, availableCredit]);

  /**
   * Handles form submission. Prevents default form behavior, validates the form input
   * and if valid, creates or updates a customer in the database, based on whether an ID
   * is present in the URL. If the submission is successful, redirects to the list page.
   * If not, sets an error message.
   * @param {React.FormEvent} event The form submission event
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newCustomer: Customer = {
      id: id || "",
      name,
      email,
      availableCredit,
    };

    try {
      if (id) {
        await updateCustomer(newCustomer);
      } else {
        await createCustomer(newCustomer);
      }
      // Invokes the `onSubmit` prop for tests
      onSubmit?.(newCustomer);

      navigate("/"); // Redirects to list
    } catch (err: any) {
      setError(handleError(err, "An error occurred while submitting the form."));
    }
  };

  /**
   * Returns a function that can be used as the event handler for an
   * `input` element. This function takes a setter function (e.g. the
   * return value of `useState`) and returns a function that takes the
   * ChangeEvent from the input element and calls the setter with the
   * value from the input element. This is a common pattern when
   * working with form elements in React.
   * @param {React.Dispatch<React.SetStateAction<any>>} setter
   *   The setter function to call with the input element's value.
   * @return {(e: React.ChangeEvent<HTMLInputElement>) => void}
   *   A function that takes a ChangeEvent and calls the setter with
   *   the input element's value.
   */
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>
  ) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  };

  if (loading) {
    return <div>Loading customer data...</div>;
  }

  return (
    <div>
      <h1>{id ? "Update Customer" : "Create Customer"}</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <InputField
          id="name"
          label="Name *"
          value={name}
          onChange={handleInputChange(setName)}
          required
        />
        <InputField
          id="email"
          label="Email * "
          type="email"
          value={email}
          onChange={handleInputChange(setEmail)}
          required
        />
        <InputField
          id="availableCredit"
          label="Available Credit *"
          type="number"
          value={availableCredit}
          onChange={handleInputChange((val) => setAvailableCredit(Number(val)))}
          min={0}
          required
        />

        <button type="submit">{id ? "Update" : "Create"} Customer</button>
      </form>

      <button onClick={() => navigate("/")}>Back to List</button>
    </div>
  );
};

/**
 * A reusable input field component for the form.
 */
const InputField: React.FC<{
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  required?: boolean;
}> = ({ id, label, value, onChange, type = "text", min, required }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        style={{ marginLeft: "10px" }}
      />
    </div>
  );
};
