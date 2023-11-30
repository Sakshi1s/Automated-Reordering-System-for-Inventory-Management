from flask import Flask, render_template, request, jsonify, redirect, url_for
import pickle
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor

app = Flask(__name__)

reorder_data = pd.read_csv('SalesFINAL12312016.csv')


# Load the model and encoder
string_features = ['Description','SalesDate']

# Encode the string features using one-hot encoding
encoder = OneHotEncoder(sparse=False, handle_unknown='ignore')
encoded_features = encoder.fit_transform(reorder_data[string_features])
# Assuming df_sales is your DataFrame
numerical_features = ['Brand', 'SalesQuantity','LEAD_TIME']
string_features = ['Description', 'SalesDate']

# Assuming 'reorder_point' is your target variable
target = reorder_data['SalesPrice']

# Encode the string features using one-hot encoding
encoded_features = encoder.transform(reorder_data[string_features])

# Combine encoded features with numerical features
features = np.concatenate((encoded_features, reorder_data[numerical_features]), axis=1)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

# Initialize the Gradient Boosting Regressor
gbr = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)

# Train the model
gbr.fit(X_train, y_train)    

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/reord', methods=['POST'])
def result():
        brand = request.form['product']
        description = request.form['des']
        sales_quantity = request.form['shipped']
        sales_price = request.form['sales_price']
        sales_date = request.form['sald']
        lead_time = request.form['shipped']

        # Encode the new instance
        encoded_instance = encoder.transform([[description, sales_date]])

        # Combine encoded instance with numerical features
        instance_features = pd.concat([pd.DataFrame(encoded_instance), pd.DataFrame([[brand, sales_quantity,lead_time]])], axis=1)

        # Make predictions
        reorder_point_result = gbr.predict(instance_features)[0]

        return render_template('result.html', reorder_point=reorder_point_result)

if __name__ == '__main__':
    app.run(debug=True)
