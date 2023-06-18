<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QueryController extends Controller
{
    public function reverseData($data)
{
    $reversedData = [];

    foreach ($data as $key => $value) {
        if (is_array($value)) {
            // If the value is an array, recursively reverse it
            $reversedValue = $this->reverseData($value);
        } else {
            // Reverse the value if it's not an array
            $reversedValue = strrev($value);
        }

        // Reverse the key
        $reversedKey = strrev($key);

        // Add the reversed key-value pair to the reversed data
        $reversedData[$reversedKey] = $reversedValue;
    }

    return $reversedData;
}

public function query(Request $request)
{
    // Step 2a: Wait for frontend queries

    // Step 2b: Query URL requested by frontend queries
    $response = $request->urlData;

    // Reverse the data using the reverseData() method
    $reversedObjects = array_reverse($response['results']);

    $reversedResponse = [];
    foreach ($reversedObjects as $object) {
        $reversedObject = $this->reverseData($object);
        $reversedResponse['stluser'][] = $reversedObject;
    }

    // Reverse the other values
    $reversedResponse['muNegap'] = strrev($response['pageNum']);
    $reversedResponse['segaPmuNlatot'] = strrev($response['totalNumPages']);
    $reversedResponse['dnuof'] = strrev($response['found']);

    // Step 2e: Respond to frontend query with both original URL response from 2b
    // and processed result from 2d
    return response()->json([
        'originalResponse' => $response,
        'processedResult' => $reversedResponse,
    ], 200);
}

}
