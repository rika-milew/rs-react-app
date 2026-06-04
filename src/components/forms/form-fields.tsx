export function FormFields() {
  return (
    <>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" defaultValue="" required />
      </div>
      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          defaultValue=""
          min={0}
          required
        />
      </div>
      <div>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" defaultValue="" required>
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue="" required />
      </div>
      <div>
        <input id="terms" name="terms" type="checkbox" defaultChecked={false} />
        <label htmlFor="terms">Accept Terms & Conditions</label>
      </div>
    </>
  );
}
